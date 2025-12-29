/**
 * OpenTelemetry Tracing Configuration
 * Sets up tracing for OpenAI SDK calls using Traceloop instrumentation
 * Follows AI Toolkit best practices for observability
 */

const { resourceFromAttributes } = require("@opentelemetry/resources");
const {
  NodeTracerProvider,
  SimpleSpanProcessor,
} = require("@opentelemetry/sdk-trace-node");
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-proto");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const { OpenAIInstrumentation } = require("@traceloop/instrumentation-openai");

/**
 * Initialize OpenTelemetry tracing for OpenAI SDK
 * @param {string} serviceName - Name of the service (default: 'codespaces-react')
 * @param {string} otlpEndpoint - OTLP endpoint URL (default: localhost:4318)
 */
function initializeTracing(serviceName = "codespaces-react", otlpEndpoint = "http://localhost:4318/v1/traces") {
  try {
    // Create OTLP exporter
    const exporter = new OTLPTraceExporter({
      url: otlpEndpoint,
    });

    // Create tracer provider with resource attributes
    const provider = new NodeTracerProvider({
      resource: resourceFromAttributes({
        "service.name": serviceName,
      }),
      spanProcessors: [
        new SimpleSpanProcessor(exporter)
      ],
    });

    // Register the provider
    provider.register();

    // Register OpenAI instrumentation
    registerInstrumentations({
      instrumentations: [new OpenAIInstrumentation()],
    });

    console.log(`✓ OpenTelemetry tracing initialized for ${serviceName}`);
    console.log(`  Exporting traces to: ${otlpEndpoint}`);
  } catch (error) {
    console.error("Failed to initialize tracing:", error);
    // Don't crash the app if tracing fails
  }
}

module.exports = { initializeTracing };
