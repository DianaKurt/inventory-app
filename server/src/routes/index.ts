import { Router } from 'express'
import { authRouter } from './auth'
import { inventoriesRouter } from './inventories'
import { itemsRouter } from './items'
import { tagsRouter } from './tags'
import { usersRouter } from './users'
import { searchRouter } from './search'
import { meRouter } from './me'
import { adminRouter } from './admin'
import { debugRouter } from './debug'


export const apiRouter = Router()

apiRouter.use('/auth', authRouter)
apiRouter.use('/inventories', inventoriesRouter)
apiRouter.use('/items', itemsRouter)
apiRouter.use('/tags', tagsRouter)
apiRouter.use('/users', usersRouter)
apiRouter.use('/search', searchRouter)
apiRouter.use('/me', meRouter)
apiRouter.use('/admin', adminRouter)
apiRouter.use('/debug', debugRouter)
