#!/bin/sh
# vim:sw=4:ts=4:et

set -e

ME=$(basename $0)
DEFAULT_CONF_FILE="/etc/nginx/conf.d/default.conf"

# check if we have ipv6 available
if [ ! -f "/proc/net/if_inet6" ]; then
    echo >&3 "$ME: info: ipv6 not available"
    exit 0
fi

if [ ! -f "/$DEFAULT_CONF_FILE" ]; then
    echo >&3 "$ME: info: /$DEFAULT_CONF_FILE is not a file or does not exist"
    exit 0
fi

# check if the file can be modified, e.g. not on a r/o filesystem
touch /$DEFAULT_CONF_FILE 2>/dev/null || { echo >&3 "$ME: info: can not modify /$DEFAULT_CONF_FILE (read-only file system?)"; exit 0; }

# check if the file is already modified, e.g. on a container restart
grep -q "listen  \[::]\:80;" /$DEFAULT_CONF_FILE && { echo >&3 "$ME: info: IPv6 listen already enabled"; exit 0; }

if [ -f "/etc/os-release" ]; then
    . /etc/os-release
else
    echo >&3 "$ME: info: can not guess the operating system"
    exit 0
fi

if [ -f "/usr/bin/sed" ]; then
    sed -i -E 's,listen       80;,listen       80;\n    listen  [::]:80;,' /$DEFAULT_CONF_FILE
else
    echo >&3 "$ME: info: sed binary not found, exiting"
    exit 0
fi

echo >&3 "$ME: info: Getting the checksum of /$DEFAULT_CONF_FILE"

if [ -f "/usr/bin/md5sum" ]; then
    CHECKSUM=$(md5sum /$DEFAULT_CONF_FILE)
elif [ -f "/usr/bin/sha1sum" ]; then
    CHECKSUM=$(sha1sum /$DEFAULT_CONF_FILE)
elif [ -f "/usr/bin/shasum" ]; then
    CHECKSUM=$(shasum -a1 /$DEFAULT_CONF_FILE)
else
    echo >&3 "$ME: info: no checksum binary found, exiting"
    exit 0
fi

echo >&3 "$ME: info: Enabled listen on IPv6 in /$DEFAULT_CONF_FILE, checksum is $CHECKSUM"

exit 0
