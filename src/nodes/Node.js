import Class from 'lowclass'
import randomstring from 'randomstring'

import Motor from '../core/Motor'
import Transform from '../nodeComponents/Transform'

import Privates from '../utilities/Privates'
let __ = new Privates()

/**
 * @public
 * @class Node
 */
export default
Class ('Node', {

    /**
     * @constructor
     */
    Node() {

        // Motor is a singleton, so if it already exists, the existing one is
        // returned from the constructor here.
        let motor = __(this).motor = new Motor

        // new Nodes get a new random ID, used to associate the UI Node with a
        // twin WorkerNode.
        let id = this.id = this.idPrefix + '#' + randomstring.generate()

        // registers this Node with the Motor, which creates it's worker twin
        // in the SceneWorker.
        motor.registerNode(this)

        if (this.useDefaultComponents) {
            this.addComponent(new Transform)
        }
    },

    // don't override this unless you know what you're doing.
    get idPrefix() {
        return "Node"
    },

    get useDefaultComponents() {
        return true
    },

    addChild() {},

    addComponent(component) {
        console.log('Add component: ', component)
        component.addTo(this)
    },
})
