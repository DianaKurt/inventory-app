import { Router } from 'express'
import { getMe, loginByEmail, registerByEmail } from '../services/auth.service'
import { Role } from '@prisma/client'

export const authRouter = Router()


authRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body ?? {}
    if (!email || !password) throw { status: 400, message: 'email and password are required' }

    const user = await loginByEmail(String(email), String(password))

    req.session.userId = user.id
    req.session.role = user.role ?? undefined

    await new Promise<void>((resolve, reject) => {
      req.session.save((err) => (err ? reject(err) : resolve()))
    })

    console.log('[login] saved session', { sid: req.sessionID, userId: req.session.userId, role: req.session.role })

    res.json(user)
  } catch (e) {
    next(e)
  }
})

authRouter.post('/register', async (req, res, next) => {
  try {
    const { email, password, name } = req.body ?? {}
    if (!email || !password) throw { status: 400, message: 'email and password are required' }

    const user = await registerByEmail({
      email: String(email),
      password: String(password),
      name: name ? String(name) : undefined,
      role: Role.USER,
    })

    req.session.userId = user.id
    req.session.role = user.role ?? undefined

    await new Promise<void>((resolve, reject) => {
      req.session.save((err) => (err ? reject(err) : resolve()))
    })

    console.log('[register] saved session', { sid: req.sessionID, userId: req.session.userId, role: req.session.role })

    res.status(201).json(user)
  } catch (e) {
    next(e)
  }
})

authRouter.post('/register', async (req, res, next) => {
  console.log('REGISTER REQUEST BODY:', req.body)

  try {
    const user = await registerByEmail(req.body)
    console.log('USER CREATED:', user)

    req.session.userId = user.id
    res.status(201).json(user)
  } catch (e) {
    console.error('REGISTER ERROR:', e)
    next(e)
  }
})
authRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body ?? {}
    if (!email || !password) {
      throw { status: 400, message: 'email and password are required' }
    }

    const user = await loginByEmail(String(email), String(password))
    req.session.userId = user.id
    req.session.role = user.role ?? undefined

    res.json(user)
  } catch (e) {
    next(e)
  }
})

authRouter.post('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true })
  })
})

authRouter.get('/me', async (req, res, next) => {
  try {
    res.setHeader('Cache-Control', 'no-store')
    if (!req.session.userId) throw { status: 401, message: 'Unauthorized' }
    const user = await getMe(req.session.userId)
    res.json(user)
  } catch (e) {
    next(e)
  }
})


authRouter.post('/register', async (req, res, next) => {
  try {
    const { email, password, name } = req.body ?? {}
    if (!email || !password) throw { status: 400, message: 'email and password are required' }

    const user = await registerByEmail({
      email: String(email),
      password: String(password),
      name: name ? String(name) : undefined,
      role: Role.USER,
    })
    //logim
    req.session.userId = user.id
    req.session.role = user.role ?? undefined

    res.status(201).json(user)
  } catch (e) {
    next(e)
  }
})