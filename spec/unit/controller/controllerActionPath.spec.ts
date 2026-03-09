import UsersController from '../../../test-app/src/app/controllers/UsersController.js'
import ApiUsersController from '../../../test-app/src/app/controllers/Api/UsersController.js'
import ApiV1UsersController from '../../../test-app/src/app/controllers/Api/V1/UsersController.js'

describe('PsychicController', () => {
  describe('.controllerActionPath', () => {
    it('returns the controller name and action in Controller#action format', () => {
      expect(UsersController.controllerActionPath('helloWorld')).toEqual('Users#helloWorld')
    })

    it('works for namespaced controllers', () => {
      expect(ApiUsersController.controllerActionPath('create')).toEqual('Api/Users#create')
    })

    it('works for deeply namespaced controllers', () => {
      expect(ApiV1UsersController.controllerActionPath('index')).toEqual('Api/V1/Users#index')
    })
  })

  describe('.disaplayName', () => {
    it('returns the controller name without controllers/ prefix and Controller suffix', () => {
      expect(UsersController.disaplayName).toEqual('Users')
    })

    it('works for namespaced controllers', () => {
      expect(ApiUsersController.disaplayName).toEqual('Api/Users')
    })
  })
})
