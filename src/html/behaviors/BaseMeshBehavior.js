import { BoxGeometry, MeshPhongMaterial } from 'three'
import {withUpdate} from '@trusktr/skatejs'
import Class from 'lowclass'
import Mesh from '../../core/Mesh'
import forwardProps from './forwardProps'

// base class for Geometry and Material behaviors, not to be used directly
export default
Class( 'BaseMeshBehavior' ).extends( withUpdate( forwardProps ), ({ Public, Protected, Private, Super }) => ({

    constructor(element) {
        let _this = Super(this).constructor()

        _this.element = element

        if ( element.nodeName.includes('-') ) {
            const whenDefined = customElements.whenDefined(element.nodeName.toLowerCase())
            .then(() => {
                if (element instanceof Mesh) return true
                else return false
            })

            const sleep = t => new Promise(r => setTimeout(() => r(false), t))
            const sleepPromise = sleep(10000)

            Promise.race([whenDefined, sleepPromise]).then(isMesh => {
                if (!isMesh) throw new Error(`
                    The element you're using the mesh behavior on is not a Mesh
                    element (or timeout waiting for the Mesh element definition
                    after 10 seconds).
                `)
            })
        }

        return _this
    },

    // proxy setAttribute to this.element so that SkateJS withUpdate works in certain cases
    setAttribute(name, value) {
        this.element.setAttribute(name, value)
    },

    connectedCallback() {
        Super( this ).connectedCallback()

        // TODO might have to defer so that calculatedSize is already calculated
        //console.log('hmmmmmmmmmmmmmmmmmmmmmmmmmmmm')
        Protected(this).setMeshComponent(
            this.element,
            this.constructor.type,
            Protected(this).createComponent(this.element)
        )
        this.element._needsToBeRendered()
    },

    disconnectedCallback() {
        Super( this ).disconnectedCallback()

        Protected(this).setDefaultComponent( this.element, this.constructor.type )
        this.element._needsToBeRendered()
    },

    private: {
        // records the initial size of the geometry, so that we have a
        // reference for how much scale to apply when accepting new sizes from
        // the user.
        initialSize: null,
    },

    protected: {
        // used by forwardProps. See forwardProps.js
        get observedObject() {
            return Public( this ).element
        },

        createComponent() {
            throw new Error('`createComponent()` is not implemented by subclass.')
        },

        setMeshComponent(element, name, newComponent) {
            if ( element.threeObject3d[ name ] )
                element.threeObject3d[ name ].dispose()

            element.threeObject3d[name] = newComponent
        },

        setDefaultComponent( element, name ) {
            this.setMeshComponent( element, name, this.makeDefaultComponent( element, name ) )
        },

        makeDefaultComponent( element, name ) {
            if (name == 'geometry') {
                return new BoxGeometry(
                    element.calculatedSize.x,
                    element.calculatedSize.y,
                    element.calculatedSize.z,
                )
            }
            else if (name == 'material') {
                return new MeshPhongMaterial( { color: 0xff6600 } )
            }
        },
    },
}))
