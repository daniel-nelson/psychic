import PsychicController from '../../../src/controller/index.js'
import { createMockKoaContext } from './helpers/mockRequest.js'

describe('PsychicController', () => {
  describe('get #params', () => {
    it('returns both body and query params', () => {
      const ctx = createMockKoaContext({
        body: { search: 'abc' },
        query: { cool: 'boyjohnson' },
      })
      const controller = new PsychicController(ctx, { action: 'hello' })

      expect(controller.params.search).toEqual('abc')
      expect(controller.params.cool).toEqual('boyjohnson')
    })

    it('includes route params (URL params)', () => {
      const ctx = createMockKoaContext({
        params: { id: '42' },
      })
      const controller = new PsychicController(ctx, { action: 'show' })

      expect(controller.params.id).toEqual('42')
    })

    it('merges query, body, and route params together', () => {
      const ctx = createMockKoaContext({
        query: { from: 'query' },
        body: { from_body: 'body' },
        params: { id: '1' },
      })
      const controller = new PsychicController(ctx, { action: 'show' })

      expect(controller.params).toEqual(
        expect.objectContaining({
          from: 'query',
          from_body: 'body',
          id: '1',
        }),
      )
    })

    it('route params take precedence over body params which take precedence over query params', () => {
      const ctx = createMockKoaContext({
        query: { shared: 'from-query' },
        body: { shared: 'from-body' },
      })
      const controller = new PsychicController(ctx, { action: 'show' })

      expect(controller.params.shared).toEqual('from-body')
    })

    it('returns empty object values when no params are present', () => {
      const ctx = createMockKoaContext()
      const controller = new PsychicController(ctx, { action: 'index' })

      expect(controller.params).toEqual({})
    })
  })

  describe('#param', () => {
    it('returns a single parameter value', () => {
      const ctx = createMockKoaContext({
        body: { name: 'alice' },
      })
      const controller = new PsychicController(ctx, { action: 'show' })

      expect(controller.param('name')).toEqual('alice')
    })

    it('returns undefined for non-existent parameters', () => {
      const ctx = createMockKoaContext()
      const controller = new PsychicController(ctx, { action: 'show' })

      expect(controller.param('nonexistent')).toBeUndefined()
    })
  })

  describe('get #headers', () => {
    it('returns request headers', () => {
      const ctx = createMockKoaContext({
        headers: { 'content-type': 'application/json', authorization: 'Bearer token123' },
      })
      const controller = new PsychicController(ctx, { action: 'show' })

      expect(controller.headers['content-type']).toEqual('application/json')
      expect(controller.headers.authorization).toEqual('Bearer token123')
    })
  })
})
