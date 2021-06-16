import { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'
import { getSignature } from '../src/python/surfaceview3/gui/labbox/kachery-js/types/crypto_util'
import { isKacheryNodeRequestBody, KacheryNodeRequest } from '../src/python/surfaceview3/gui/labbox/kachery-js/types/kacheryNodeRequestTypes'
import { JSONValue } from '../src/python/surfaceview3/gui/labbox/kachery-js/types/kacheryTypes'
import getKeyPair from './common/getKeyPair'
import getNodeId from './common/getNodeId'

const keyPair = getKeyPair()
const nodeId = getNodeId()

const kacheryHubUrl = 'https://kacheryhub.org'

module.exports = (req: VercelRequest, res: VercelResponse) => {    
    const {body: requestBody} = req
    if (!isKacheryNodeRequestBody(requestBody)) {
        console.warn('Invalid request body', requestBody)
        res.status(400).send(`Invalid request body: ${JSON.stringify(requestBody)}`)
        return
    }

    ;(async () => {
        let okay = false
        if (requestBody.type === 'getChannelConfig') {
            okay = true
        }
        else if (requestBody.type === 'getPubsubAuthForChannel') {
            okay = true
        }
        else if (requestBody.type === 'getNodeConfig') {
            okay = true
        }
        if (!okay) {
            throw Error(`Illegal kachery node request: ${requestBody["type"]}`)
        }
        const request: KacheryNodeRequest = {
            body: requestBody,
            nodeId,
            signature: getSignature(requestBody, keyPair)
        }
        const x = await axios.post(`${kacheryHubUrl}/api/kacheryNode`, request)
        const response: JSONValue = x.data
        return response
    })().then((result) => {
        res.json(result)
    }).catch((error: Error) => {
        console.warn(error.message)
        res.status(404).send(`Error: ${error.message}`)
    })
}