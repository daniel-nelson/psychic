import { specRequest as request } from '@rvoh/psychic-spec-helpers'
import { PsychicServer } from '../../../../src/package-exports/index.js'

describe('response statuses', () => {
  beforeEach(async () => {
    await request.init(PsychicServer)
  })

  // 2xx responses with body content
  describe.each([
    { status: 200, route: '/ok', expectedBody: 'custom content' },
    { status: 201, route: '/created', expectedBody: 'custom content' },
    { status: 202, route: '/accepted', expectedBody: 'custom content' },
    { status: 203, route: '/non-authoritative-information', expectedBody: 'custom content' },
  ])('$status response with body', ({ status, route, expectedBody }) => {
    it(`returns ${status} with expected body`, async () => {
      const res = await request.get(route, status)
      expect(res.body).toEqual(expectedBody)
    })
  })

  // 200 edge cases
  describe('200 edge cases', () => {
    it('renders undefined as a blank object', async () => {
      const res = await request.get('/ok-undefined', 200)
      expect(res.body).toEqual({})
    })

    it('renders null as null', async () => {
      const res = await request.get('/ok-null', 200)
      expect(res.body).toBeNull()
    })
  })

  // 2xx responses with no body
  describe.each([
    { status: 204, route: '/no-content' },
    { status: 205, route: '/reset-content' },
  ])('$status response with no body', ({ status, route }) => {
    it(`returns ${status}`, async () => {
      await request.get(route, status)
    })
  })

  // 3xx redirect responses
  describe.each([
    { status: 301, route: '/moved-permanently' },
    { status: 302, route: '/found' },
    { status: 303, route: '/see-other' },
    { status: 307, route: '/temporary-redirect' },
    { status: 308, route: '/permanent-redirect' },
  ])('$status redirect response', ({ status, route }) => {
    it(`returns ${status} with location header`, async () => {
      const res = await request.get(route, status)
      expect(res.header.location).toEqual('/chalupas')
    })
  })

  // 304 Not Modified (special case: requires conditional request)
  describe('304 Not Modified', () => {
    it('returns 304 when etag matches', async () => {
      const res = await request.get('/ok', 200)

      await request.get('/ok', 304, {
        headers: {
          ['if-none-match']: res.headers.etag!,
        },
      })
    })
  })

  // 4xx client error responses with custom message body
  describe.each([
    { status: 401, route: '/unauthorized' },
    { status: 402, route: '/payment-required' },
    { status: 403, route: '/forbidden' },
    { status: 405, route: '/method-not-allowed' },
    { status: 406, route: '/not-acceptable' },
    { status: 407, route: '/proxy-authentication-required' },
    { status: 410, route: '/gone' },
    { status: 412, route: '/precondition-failed' },
    { status: 413, route: '/content-too-large' },
    { status: 415, route: '/unsupported-media-type' },
    { status: 417, route: '/expectation-failed' },
    { status: 418, route: '/im-a-teapot' },
    { status: 421, route: '/misdirected-request' },
    { status: 423, route: '/locked' },
    { status: 424, route: '/failed-dependency' },
    { status: 428, route: '/precondition-required' },
    { status: 429, route: '/too-many-requests' },
    { status: 431, route: '/request-header-fields-too-large' },
    { status: 451, route: '/unavailable-for-legal-reasons' },
  ])('$status client error with message', ({ status, route }) => {
    it(`returns ${status} with custom message body`, async () => {
      const res = await request.get(route, status)
      expect(res.body).toEqual('custom message')
    })
  })

  // 4xx client error responses with no body assertion
  describe.each([
    { status: 400, route: '/bad-request' },
    { status: 409, route: '/conflict' },
  ])('$status client error without body', ({ status, route }) => {
    it(`returns ${status}`, async () => {
      await request.get(route, status)
    })
  })

  // 404 Not Found (has additional "record not found" context)
  describe('404 Not Found', () => {
    it('returns 404', async () => {
      await request.get('/not-found', 404)
    })

    it('returns 404 when a record is not found', async () => {
      await request.get('/record-not-found', 404)
    })
  })

  // 422 Unprocessable Content (has structured error body)
  describe('422 Unprocessable Content', () => {
    it('returns 422 with validation error payload', async () => {
      const res = await request.get('/unprocessable-content', 422)
      expect(res.body).toEqual({ errors: { hello: ['world'] } })
    })
  })

  // 5xx server error responses with no body assertion
  describe.each([
    { status: 500, route: '/internal-server-error' },
  ])('$status server error without body', ({ status, route }) => {
    it(`returns ${status}`, async () => {
      await request.get(route, status)
    })
  })

  // 5xx server error responses with custom message body
  describe.each([
    { status: 501, route: '/not-implemented' },
    { status: 502, route: '/bad-gateway' },
    { status: 503, route: '/service-unavailable' },
    { status: 504, route: '/gateway-timeout' },
    { status: 507, route: '/insufficient-storage' },
    { status: 510, route: '/not-extended' },
  ])('$status server error with message', ({ status, route }) => {
    it(`returns ${status} with custom message body`, async () => {
      const res = await request.get(route, status)
      expect(res.body).toEqual('custom message')
    })
  })
})
