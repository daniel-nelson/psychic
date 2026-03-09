import { agent as supertest } from 'supertest'
import PsychicRouter from '../../../src/router/index.js'
import PsychicServer from '../../../src/server/index.js'
import UsersController from '../../../test-app/src/app/controllers/UsersController.js'

describe('PsychicRouter HTTP methods', () => {
  let server: PsychicServer
  let router: PsychicRouter

  beforeEach(() => {
    server = new PsychicServer()
    router = new PsychicRouter(server.koaApp)
  })

  describe.each(['get', 'post', 'put', 'patch', 'delete', 'options'] as const)(
    '#%s',
    httpMethod => {
      it(`can direct ${httpMethod} requests to controller`, async () => {
        await server.boot()
        const res = await supertest(server.koaApp.callback())[httpMethod]('/ping').expect(200)
        if (httpMethod !== 'options') {
          expect(res.body).toEqual('helloworld')
        }
      })

      if (httpMethod !== 'options') {
        it('registers the route with correct method, path, controller, and action', () => {
          router[httpMethod]('/ping', UsersController, 'ping')
          router.commit()

          expect(router.routes).toEqual(
            expect.arrayContaining([
              {
                httpMethod,
                path: '/ping',
                controller: UsersController,
                action: 'ping',
              },
            ]),
          )
        })
      }
    },
  )

  describe('namespaced routes', () => {
    it('can direct single-level namespaced routes to their respective controllers', async () => {
      await server.boot()

      const res = await supertest(server.koaApp.callback()).get('/api-ping').expect(200)

      expect(res.body).toEqual('hellonestedworld')
    })

    it('can direct multi-level namespaced routes to their respective controllers', async () => {
      await server.boot()

      const res = await supertest(server.koaApp.callback()).get('/api/v1/ping').expect(200)

      expect(res.body).toEqual('hellodoublenestedworld')
    })
  })
})
