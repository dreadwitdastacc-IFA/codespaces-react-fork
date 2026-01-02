#!/bin/sh
# vim:sw=4:ts=4:et

set -e

ME=$(basename $0)
NGINX_CONF_FILE="/etc/nginx/nginx.conf"

is_command() {
  command -v "$1" >/dev/null
}

if [ -z "${NGINX_ENTRYPOINT_WORKER_PROCESSES_AUTOTUNE}" ]; then
  return 0
fi

touch $NGINX_CONF_FILE 2>/dev/null || { echo >&3 "$ME: error: can not modify $NGINX_CONF_FILE (read-only file system?)"; exit 0; }

ceildiv() {
  num=$1
  div=$2
  echo $(( (num + div - 1) / div ))
}

get_cpuset() {
  cpusetroot=$1
  cpusetfile=$2
  ncpu=0
  [ -f "$cpusetroot/$cpusetfile" ] || return 1
  for token in $( tr ',' ' ' < "$cpusetroot/$cpusetfile" ); do
    case "$token" in
      *-*)
        count=$( seq $(echo "$token" | tr '-' ' ') | wc -l )
        ncpu=$(( ncpu+count ))
        ;;
      *)
        ncpu=$(( ncpu+1 ))
        ;;
    esac
  done
  echo "$ncpu"
}

get_quota() {
  cpuroot=$1
  ncpu=0
  [ -f "$cpuroot/cpu.cfs_quota_us" ] || return 1
  [ -f "$cpuroot/cpu.cfs_period_us" ] || return 1
  cfs_quota=$( cat "$cpuroot/cpu.cfs_quota_us" )
  cfs_period=$( cat "$cpuroot/cpu.cfs_period_us" )
  [ "$cfs_quota" = "-1" ] && return 1
  [ "$cfs_period" = "0" ] && return 1
  ncpu=$( ceildiv "$cfs_quota" "$cfs_period" )
  [ "$ncpu" -gt 0 ] || return 1
  echo "$ncpu"
}

get_quota_v2() {
  cpuroot=$1
  ncpu=0
  [ -f "$cpuroot/cpu.max" ] || return 1
  cfs_quota=$( awk '{print $1}' "$cpuroot/cpu.max" )
  cfs_period=$( awk '{print $2}' "$cpuroot/cpu.max" )
  [ "$cfs_quota" = "max" ] && return 1
  [ "$cfs_period" = "0" ] && return 1
  ncpu=$( ceildiv "$cfs_quota" "$cfs_period" )
  [ "$ncpu" -gt 0 ] || return 1
  echo "$ncpu"
}

get_cgroup_v1_path() {
  needle=$1
  found=
  foundroot=
  mountpoint=

  [ -r "/proc/self/mountinfo" ] || return 1
  [ -r "/proc/self/cgroup" ] || return 1

  while IFS= read -r line; do
    case "$needle" in
      "cpuset")
        case "$line" in
          *cpuset*)
            found=$( echo "$line" | cut -d ' ' -f 4,5 )
            break
            ;;
        esac
        ;;
      "cpu")
        case "$line" in
          *cpuacct*,cpu,cpuacct*|*cpuacct*,cpu|*cpu,cpuacct*|*cpu|*cpu,cpuacct)
            found=$( echo "$line" | cut -d ' ' -f 4,5 )
            break
            ;;
        esac
    esac
  done << __EOF__
$( grep -F -- '- cgroup ' /proc/self/mountinfo )
__EOF__

  while IFS= read -r line; do
    controller=$( echo "$line" | cut -d: -f 2 )
    case "$needle" in
      "cpuset")
        case "$controller" in
          cpuset)
            mountpoint=$( echo "$line" | cut -d: -f 3 )
            break
            ;;
        esac
        ;;
      "cpu")
        case "$controller" in
          *,cpu,*|*,cpu|cpu,*|cpu)
            mountpoint=$( echo "$line" | cut -d: -f 3 )
            break
            ;;
        esac
    esac
done << __EOF__
$( grep -F -- 'cpu' /proc/self/cgroup )
__EOF__

  case "${found%% *}" in
    "/")
      foundroot="${found##* }$mountpoint"
      ;;
    "$mountpoint")
      foundroot="${found##* }"
      ;;
  esac
  echo "$foundroot"
}

get_cgroup_v2_path() {
  found=
  foundroot=
  mountpoint=

  [ -r "/proc/self/mountinfo" ] || return 1
  [ -r "/proc/self/cgroup" ] || return 1

  while IFS= read -r line; do
    case "$line" in
      *" - cgroup2 "*|*" - cgroup cgroup2 "*)
        found=$( echo "$line" | cut -d ' ' -f 4,5 )
        break
        ;;
    esac
  done << __EOF__
$( grep -F -- '- cgroup' /proc/self/mountinfo )
__EOF__

  while IFS= read -r line; do
    mountpoint=$( echo "$line" | cut -d: -f 3 )
done << __EOF__
$( grep -F -- '0::' /proc/self/cgroup )
__EOF__

  case "${found%% *}" in
    "")
      return 1
      ;;
    "/")
      foundroot="${found##* }$mountpoint"
      ;;
    "$mountpoint")
      foundroot="${found##* }"
      ;;
  esac
  echo "$foundroot"
}

ncpu_online=$( getconf _NPROCESSORS_ONLN )
ncpu_cpuset=
ncpu_quota=
ncpu_cpuset_v2=
ncpu_quota_v2=

ncpu=0
cpuset=
cgroup_v1=
cgroup_v2=$( get_cgroup_v2_path ) && ncpu_cpuset_v2=$( get_cpuset "$cgroup_v2" "cpuset.cpus.effective" ) || ncpu_cpuset_v2=$ncpu_online
if [ -n "$cgroup_v2" ]; then
  ncpu_quota_v2=$( get_quota_v2 "$cgroup_v2" ) || ncpu_quota_v2=$ncpu_online
  ncpu=$( min "$ncpu_cpuset_v2" "$ncpu_quota_v2" )
else
  cpuset=$( get_cgroup_v1_path "cpuset" ) && ncpu_cpuset=$( get_cpuset "$cpuset" "cpuset.cpus" ) || ncpu_cpuset=$ncpu_online
  cgroup_v1=$( get_cgroup_v1_path "cpu" ) && ncpu_quota=$( get_quota "$cgroup_v1" ) || ncpu_quota=$ncpu_online
  ncpu=$( min "$ncpu_cpuset" "$ncpu_quota" )
fi

if command -v nproc > /dev/null && [ "$ncpu" -gt "$( nproc )" ]; then
  ncpu=$( nproc )
fi

if [ "$ncpu" -eq 0 ]; then
  ncpu=1
fi

if is_command nproc; then
  if [ "$ncpu" -gt "$(nproc)" ]; then
    ncpu="$(nproc)"
  fi
fi

echo >&3 "$ME: info: setting worker_processes to $ncpu"
sed -i "s/worker_processes\s\+auto;/worker_processes  $ncpu;/" "$NGINX_CONF_FILE"

exit 0
