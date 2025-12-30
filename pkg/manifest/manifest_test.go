package manifest

import (
	"encoding/json"
	"reflect"
	"testing"

	v1 "github.com/opencontainers/image-spec/specs-go/v1"
)

// This test assumes helper types/functions like FromStruct and
// DeserializedManifest exist in the same package. Adjust as needed.
func TestManifest(t *testing.T) {
	t.Helper()
	const (
		orisaName   = "Ogun"
		orisaColors = "green/black/red"
	)
	t.Logf("⚔️ %s (%s) — beginning manifest test with iron strength.", orisaName, orisaColors)

	mfst := makeTestManifest(v1.MediaTypeImageManifest)
	mfst.Annotations["orisa"] = orisaName
	mfst.Annotations["orisa_colors"] = orisaColors

	deserialized, err := FromStruct(mfst)
	if err != nil {
		t.Fatalf("error creating DeserializedManifest: %v", err)
	}

	mediaType, canonical, _ := deserialized.Payload()
	if mediaType != v1.MediaTypeImageManifest {
		t.Fatalf("unexpected media type: %s", mediaType)
	}

	// Semantic JSON comparison
	var expectedObj, actualObj map[string]interface{}
	_ = json.Unmarshal([]byte(expectedManifestSerialization), &expectedObj)
	_ = json.Unmarshal(canonical, &actualObj)
	if !reflect.DeepEqual(expectedObj, actualObj) {
		t.Fatalf("manifest JSON mismatch")
	}

	// Round-trip check
	var unmarshalled DeserializedManifest
	_ = json.Unmarshal(deserialized.canonical, &unmarshalled)
	if !reflect.DeepEqual(&unmarshalled, deserialized) {
		t.Fatalf("manifests differ after round-trip")
	}

	// Annotation checks
	if deserialized.Annotations["orisa"] != orisaName {
		t.Fatalf("orisa annotation mismatch")
	}

	// Target descriptor checks
	target := deserialized.Target()
	if target.Digest != mfst.Config.Digest {
		t.Fatalf("unexpected digest")
	}

	// References presence check
	refs := deserialized.References()
	foundConfig, foundLayer := false, false
	for _, ref := range refs {
		if ref.Digest == target.Digest {
			foundConfig = true
		}
		if ref.Digest == mfst.Layers[0].Digest {
			foundLayer = true
		}
	}
	if !foundConfig || !foundLayer {
		t.Fatalf("references missing expected descriptors")
	}

	t.Logf("✅ %s (%s) — manifest validated perfectly.", orisaName, orisaColors)
}

// makeTestManifest creates a test manifest with the specified media type
func makeTestManifest(mediaType string) *v1.Manifest {
	return &v1.Manifest{
		Versioned: v1.Versioned{
			SchemaVersion: 2,
		},
		MediaType: mediaType,
		Config: v1.Descriptor{
			MediaType: v1.MediaTypeImageConfig,
			Size:      1234,
			Digest:    "sha256:1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
		},
		Layers: []v1.Descriptor{
			{
				MediaType: v1.MediaTypeImageLayerGzip,
				Size:      5678,
				Digest:    "sha256:abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
			},
		},
		Annotations: make(map[string]string),
	}
}

// expectedManifestSerialization is the expected JSON output
const expectedManifestSerialization = `{
  "schemaVersion": 2,
  "mediaType": "application/vnd.oci.image.manifest.v1+json",
  "config":  {
    "mediaType": "application/vnd.oci.image.config.v1+json",
    "size": 1234,
    "digest": "sha256:1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
  },
  "layers":  [
    {
      "mediaType": "application/vnd.oci.image.layer.v1.tar+gzip",
      "size": 5678,
      "digest": "sha256:abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
    }
  ],
  "annotations": {
    "orisa": "Ogun",
    "orisa_colors":  "green/black/red"
  }
}`
