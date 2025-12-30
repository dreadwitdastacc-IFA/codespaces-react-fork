package aerospace

import (
	"math"
	"time"
)

// QuantumPayoutEngine - Advanced aerospace compensation calculator
// Uses relativistic mechanics, orbital dynamics, and multi-dimensional risk factors
type QuantumPayoutEngine struct {
	BaseRate          float64 // Base compensation rate ($/hour)
	GravityMultiplier float64 // G-force compensation factor
	RadiationFactor   float64 // Cosmic radiation exposure multiplier
	VelocityBonus     float64 // Relativistic velocity compensation
	OrbitComplexity   float64 // Orbital mechanics difficulty rating
}

// Mission represents an aerospace mission with physical parameters
type Mission struct {
	Duration          time.Duration // Mission duration
	MaxVelocity       float64       // Maximum velocity (m/s)
	MaxGForce         float64       // Maximum G-force experienced
	RadiationExposure float64       // Radiation dose (mSv)
	OrbitalTransfers  int           // Number of orbital maneuvers
	AltitudeMax       float64       // Maximum altitude (km)
	DeltaV            float64       // Total delta-v required (m/s)
}

// PayoutResult contains detailed payout breakdown
type PayoutResult struct {
	BasePay                float64
	GravityCompensation    float64
	RadiationCompensation  float64
	VelocityBonus          float64
	OrbitalBonus           float64
	RelativisticAdjustment float64
	HazardMultiplier       float64
	TotalPayout            float64
	RiskScore              float64
}

// NewQuantumPayoutEngine initializes the engine with standard parameters
func NewQuantumPayoutEngine() *QuantumPayoutEngine {
	return &QuantumPayoutEngine{
		BaseRate:          250.0,  // $250/hour base
		GravityMultiplier: 1000.0, // $1000 per G beyond 1G
		RadiationFactor:   500.0,  // $500 per mSv
		VelocityBonus:     0.0001, // Bonus per m/s
		OrbitComplexity:   5000.0, // $5000 per orbital transfer
	}
}

// CalculatePayout - Main payout calculation using advanced aerospace mathematics
func (qpe *QuantumPayoutEngine) CalculatePayout(m Mission) PayoutResult {
	hours := m.Duration.Hours()

	// Guard against invalid inputs
	if hours < 0 {
		hours = 0
	}
	if m.MaxVelocity < 0 {
		m.MaxVelocity = 0
	}
	if m.MaxGForce < 0 {
		m.MaxGForce = 0
	}
	if m.RadiationExposure < 0 {
		m.RadiationExposure = 0
	}
	if m.DeltaV < 0 {
		m.DeltaV = 0
	}
	if m.AltitudeMax < 0 {
		m.AltitudeMax = 0
	}

	// Base compensation
	basePay := qpe.BaseRate * hours

	// G-force compensation using a stress model
	gCompensation := 0.0
	if m.MaxGForce > 1.0 {
		gCompensation = qpe.GravityMultiplier * math.Pow(m.MaxGForce-1.0, 1.5) * hours
	}

	// Radiation exposure compensation (linear + additional term for high exposure)
	radCompensation := qpe.RadiationFactor * m.RadiationExposure
	if m.RadiationExposure > 50.0 {
		radCompensation += qpe.RadiationFactor * math.Pow(m.RadiationExposure-50.0, 1.2)
	}

	// Velocity bonus with relativistic correction
	// Using Lorentz factor: γ = 1/√(1 - v²/c²)
	c := 299792458.0 // Speed of light (m/s)
	beta := 0.0
	if c > 0 {
		beta = m.MaxVelocity / c
	}
	// Clamp beta to avoid NaN; if beta >= 1, treat as very high but safe value
	lorentzFactor := 1.0
	if beta > 0 {
		if beta >= 1.0 {
			// extremely relativistic or invalid input — clamp to a large finite value
			lorentzFactor = 1e6
		} else {
			lorentzFactor = 1.0 / math.Sqrt(1.0-beta*beta)
		}
	}
	velocityBonus := qpe.VelocityBonus * m.MaxVelocity * lorentzFactor

	// Relativistic time dilation adjustment
	relativisticAdjustment := basePay * (lorentzFactor - 1.0) * 0.1

	// Orbital mechanics complexity bonus
	orbitalBonus := qpe.OrbitComplexity * float64(m.OrbitalTransfers)

	// Delta-V difficulty multiplier (rocket equation consideration)
	deltaVMultiplier := 1.0 + (m.DeltaV / 10000.0) // Normalized

	// Altitude hazard factor (scaled)
	altitudeMultiplier := 1.0 + (m.AltitudeMax/1000.0)*0.05

	// Combined hazard multiplier
	hazardMultiplier := deltaVMultiplier * altitudeMultiplier

	// Risk score
	riskScore := qpe.calculateRiskScore(m)

	// Variable components times hazard multiplier
	totalVariable := (gCompensation + radCompensation + velocityBonus + orbitalBonus) * hazardMultiplier

	// Total payout
	totalPayout := basePay + totalVariable + relativisticAdjustment

	return PayoutResult{
		BasePay:                basePay,
		GravityCompensation:    gCompensation,
		RadiationCompensation:  radCompensation,
		VelocityBonus:          velocityBonus,
		OrbitalBonus:           orbitalBonus,
		RelativisticAdjustment: relativisticAdjustment,
		HazardMultiplier:       hazardMultiplier,
		TotalPayout:            totalPayout,
		RiskScore:              riskScore,
	}
}

// calculateRiskScore - Advanced risk assessment using multi-variable calculus
func (qpe *QuantumPayoutEngine) calculateRiskScore(m Mission) float64 {
	// Normalized risk factors (0-1 scale)
	gRisk := math.Min(m.MaxGForce/10.0, 1.0)
	radRisk := math.Min(m.RadiationExposure/100.0, 1.0)
	velRisk := math.Min(m.MaxVelocity/30000.0, 1.0) // normalized to orbital velocities
	deltaVRisk := math.Min(m.DeltaV/15000.0, 1.0)   // normalized

	// Weighted risk calculation using quadratic form
	weights := []float64{0.3, 0.25, 0.2, 0.25}
	risks := []float64{gRisk, radRisk, velRisk, deltaVRisk}

	var sumSquares float64
	for i, risk := range risks {
		sumSquares += weights[i] * risk * risk
	}

	riskScore := math.Sqrt(sumSquares) * 100.0

	// Complexity modifier
	complexityFactor := 1.0 + (float64(m.OrbitalTransfers) * 0.05)
	riskScore *= complexityFactor

	return math.Min(riskScore, 100.0)
}
