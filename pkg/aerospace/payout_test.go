package aerospace

import (
	"math"
	"testing"
	"time"
)

// Helper for float comparisons
func almostEqual(a, b, eps float64) bool {
	if eps < 0 {
		eps = 1e-9
	}
	return math.Abs(a-b) <= eps
}

func TestNewQuantumPayoutEngine(t *testing.T) {
	engine := NewQuantumPayoutEngine()
	eps := 1e-9

	if !almostEqual(engine.BaseRate, 250.0, eps) {
		t.Errorf("Expected BaseRate 250.0, got %f", engine.BaseRate)
	}
	if !almostEqual(engine.GravityMultiplier, 1000.0, eps) {
		t.Errorf("Expected GravityMultiplier 1000.0, got %f", engine.GravityMultiplier)
	}
}

func TestCalculatePayout_BasicMission(t *testing.T) {
	engine := NewQuantumPayoutEngine()

	mission := Mission{
		Duration:          8 * time.Hour,
		MaxVelocity:       7800.0, // LEO orbital velocity
		MaxGForce:         3.5,
		RadiationExposure: 0.1,
		OrbitalTransfers:  2,
		AltitudeMax:       400.0,
		DeltaV:            9400.0,
	}

	result := engine.CalculatePayout(mission)

	// Verify base pay (use tolerance)
	expectedBasePay := 250.0 * 8.0
	if !almostEqual(result.BasePay, expectedBasePay, 1e-6) {
		t.Errorf("Expected BasePay %f, got %f", expectedBasePay, result.BasePay)
	}

	// Total payout should reasonably exceed base pay
	if result.TotalPayout <= result.BasePay+1e-6 {
		t.Error("TotalPayout should exceed BasePay with hazard factors")
	}

	// Risk score in range
	if result.RiskScore < 0 || result.RiskScore > 100 {
		t.Errorf("RiskScore out of range: %f", result.RiskScore)
	}
}

func TestCalculatePayout_HighRiskMission(t *testing.T) {
	engine := NewQuantumPayoutEngine()

	mission := Mission{
		Duration:          72 * time.Hour,
		MaxVelocity:       25000.0, // High
		MaxGForce:         8.0,
		RadiationExposure: 75.0,
		OrbitalTransfers:  5,
		AltitudeMax:       35786.0, // GEO
		DeltaV:            15000.0,
	}

	result := engine.CalculatePayout(mission)

	if result.GravityCompensation <= 0 {
		t.Error("Expected positive GravityCompensation for high G-force")
	}
	if result.RadiationCompensation <= 0 {
		t.Error("Expected positive RadiationCompensation for radiation exposure")
	}
	if result.OrbitalBonus <= 0 {
		t.Error("Expected positive OrbitalBonus for transfers")
	}
	if result.RiskScore < 50.0 {
		t.Errorf("Expected high risk score, got %.2f", result.RiskScore)
	}
}

func TestCalculateRiskScore(t *testing.T) {
	engine := NewQuantumPayoutEngine()

	tests := []struct {
		name     string
		mission  Mission
		minScore float64
		maxScore float64
	}{
		{
			name: "Low Risk",
			mission: Mission{
				MaxGForce:         1.5,
				RadiationExposure: 5.0,
				MaxVelocity:       1000.0,
				DeltaV:            1000.0,
				OrbitalTransfers:  0,
			},
			minScore: 0.0,
			maxScore: 20.0,
		},
		{
			name: "Extreme Risk",
			mission: Mission{
				MaxGForce:         10.0,
				RadiationExposure: 100.0,
				MaxVelocity:       30000.0,
				DeltaV:            15000.0,
				OrbitalTransfers:  10,
			},
			minScore: 80.0,
			maxScore: 100.0,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			score := engine.calculateRiskScore(tt.mission)
			if score < tt.minScore-1e-6 || score > tt.maxScore+1e-6 {
				t.Errorf("Risk score %.2f out of expected range [%.2f, %.2f]", score, tt.minScore, tt.maxScore)
			}
		})
	}
}

func TestRelativisticEffects(t *testing.T) {
	engine := NewQuantumPayoutEngine()

	// Test at significant fraction of speed of light
	mission := Mission{
		Duration:    1 * time.Hour,
		MaxVelocity: 0.1 * 299792458.0, // 10% c
		MaxGForce:   1.0,
	}

	result := engine.CalculatePayout(mission)

	if result.RelativisticAdjustment <= 0 {
		t.Error("Expected positive relativistic adjustment at high velocity")
	}

	c := 299792458.0
	beta := mission.MaxVelocity / c
	expectedLorentz := 1.0 / math.Sqrt(1.0-beta*beta)
	if expectedLorentz <= 1.01 {
		t.Errorf("Expected significant Lorentz factor, got %.6f", expectedLorentz)
	}
}
