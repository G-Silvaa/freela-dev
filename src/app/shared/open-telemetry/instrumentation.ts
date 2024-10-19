import {registerInstrumentations} from '@opentelemetry/instrumentation';
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
  WebTracerProvider,
} from '@opentelemetry/sdk-trace-web';
import {getWebAutoInstrumentations} from '@opentelemetry/auto-instrumentations-web';
import {OTLPTraceExporter} from '@opentelemetry/exporter-trace-otlp-http';
import {Resource} from '@opentelemetry/resources';
import {B3InjectEncoding, B3Propagator} from '@opentelemetry/propagator-b3';
import {ZoneContextManager} from '@opentelemetry/context-zone';
import {
  SEMRESATTRS_DEPLOYMENT_ENVIRONMENT,
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_VERSION
} from '@opentelemetry/semantic-conventions';

const resource = Resource.default().merge(
  new Resource({
    [SEMRESATTRS_SERVICE_NAME]: 'estrutura-ux',
    [SEMRESATTRS_SERVICE_VERSION]: '0.1.0',
    [SEMRESATTRS_DEPLOYMENT_ENVIRONMENT]: 'Development'
  })
);

const provider = new WebTracerProvider({
  resource,
});

provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

provider.addSpanProcessor(
  new BatchSpanProcessor(
    new OTLPTraceExporter({
      url: 'http://192.168.100.55:4318/v1/traces',
      // headers: {
      //   'signoz-access-token': '{SIGNOZ_INGESTION_KEY}',
      // },
    })
  )
);

provider.register({
  propagator: new B3Propagator({
    injectEncoding: B3InjectEncoding.MULTI_HEADER
  }),
  contextManager: new ZoneContextManager(),
});

registerInstrumentations({
  instrumentations: [
    getWebAutoInstrumentations({
      '@opentelemetry/instrumentation-document-load': {},
      '@opentelemetry/instrumentation-user-interaction': {},
      '@opentelemetry/instrumentation-fetch': {
        propagateTraceHeaderCorsUrls: /.+/,
      },
      '@opentelemetry/instrumentation-xml-http-request': {
        propagateTraceHeaderCorsUrls: /.+/,
      },
    }),
  ],
});
