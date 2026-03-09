import Koa from 'koa'
import { MockInstance } from 'vitest'
import { OpenAPI } from '../../../src/controller/decorators.js'
import PsychicController from '../../../src/controller/index.js'
import * as toJsonModule from '../../../src/helpers/toJson.js'
import PsychicApp from '../../../src/psychic-app/index.js'
import User from '../../../test-app/src/app/models/User.js'
import processDynamicallyDefinedControllers from '../../helpers/processDynamicallyDefinedControllers.js'
import { createMockKoaContext } from './helpers/mockRequest.js'

describe('PsychicController', () => {
  describe('#respond', () => {
    let ctx: Koa.Context
    let toJsonSpy: MockInstance

    class MyController extends PsychicController {
      @OpenAPI(User, {
        fastJsonStringify: true,
        status: 201,
      })
      public create() {
        this.respond('created')
      }

      public update() {
        this.respond('updated')
      }

      @OpenAPI(User, { status: 204 })
      public destroy() {
        this.respond()
      }
    }
    processDynamicallyDefinedControllers(MyController)

    beforeEach(() => {
      ctx = createMockKoaContext({ body: { search: 'abc' }, query: { cool: 'boyjohnson' } })
      toJsonSpy = vi.spyOn(toJsonModule, 'default')
      vi.spyOn(PsychicApp.prototype, 'openapiValidationIsActive').mockReturnValue(false)
    })

    it('sets status from OpenAPI decorator and sends json', () => {
      const controller = new MyController(ctx, { action: 'create' })
      controller.create()
      expect(toJsonSpy).toHaveBeenCalledWith('created')
      expect(ctx.status).toEqual(201)
    })

    context('with no openapi decorator', () => {
      it('defaults to 200 status', () => {
        const controller = new MyController(ctx, { action: 'update' })
        controller.update()
        expect(toJsonSpy).toHaveBeenCalledWith('updated')
        expect(ctx.status).toEqual(200)
      })
    })

    context('with no data provided', () => {
      it('sends an empty object by default', () => {
        const controller = new MyController(ctx, { action: 'update' })
        controller.respond()
        expect(toJsonSpy).toHaveBeenCalledWith({})
      })
    })
  })

  describe('#send', () => {
    let ctx: Koa.Context
    let toJsonSpy: MockInstance

    beforeEach(() => {
      ctx = createMockKoaContext()
      toJsonSpy = vi.spyOn(toJsonModule, 'default')
      vi.spyOn(PsychicApp.prototype, 'openapiValidationIsActive').mockReturnValue(false)
    })

    it('accepts a numeric status code', () => {
      const controller = new PsychicController(ctx, { action: 'test' })
      controller.send({ status: 201, body: 'hello' })
      expect(ctx.status).toEqual(201)
      expect(toJsonSpy).toHaveBeenCalledWith('hello')
    })

    it('accepts a symbolic status name', () => {
      const controller = new PsychicController(ctx, { action: 'test' })
      controller.send({ status: 'created', body: 'hello' })
      expect(ctx.status).toEqual(201)
    })

    it('defaults to 200 when no status is provided', () => {
      const controller = new PsychicController(ctx, { action: 'test' })
      controller.send({})
      expect(ctx.status).toEqual(200)
    })

    it('defaults to undefined body when no body is provided', () => {
      const controller = new PsychicController(ctx, { action: 'test' })
      controller.send({ status: 204 })
      expect(toJsonSpy).toHaveBeenCalledWith(undefined)
    })
  })
})
