import { NextApiRequest, NextApiResponse } from "next";
import { updateUserPassword } from "../../database/operations/user";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { setCookie } from 'nookies'

export default async function Setup(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Invalid request method.'})
    }

    try {

        if (!req.body.userId || !req.body.password) {
            throw new Error('No userId or no password received.')
        }

        const hashedPassword = await new Promise<string>((resolve, reject) => {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) reject(err)
                resolve(hash)
            })
        }).catch(err => {
            throw err
        })

        const user = await updateUserPassword(req.body.userId, hashedPassword)

        if (!user) {
            return res.status(400).json({msg: 'This user already has a password.'})
        }

        const token = jwt.sign({
            id: user.ref.id,
            email: user.data.email,
            roles: user.data.roles
        }, process.env.JWT_TOKEN_SIGNATURE, {expiresIn: '48hr'})
        
        setCookie({res}, 'user-auth', token, {
            secure: process.env.NODE_ENV !== 'development',
            sameSite: true,
            maxAge: 172800, // 48 hours
            path: '/'
        })

        return res.status(200).json({msg: 'Success'})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
}