import Singleton from './src/common/singleton'
import Clone from './src/common/clone'
import Generator from './src/common/generator'
import Memento from './src/common/memento'

import Http from './src/http'
import Form from './src/form'
import extend from './src/extend'

const singleton = new Singleton()
const clone = singleton.Create(Clone)
const generator = singleton.Create(Generator)
const memento = singleton.Create(Memento)
const http = singleton.Create(Http)
const form = singleton.Create(Form)

export default {
    extend,
    singleton,
    clone,
    generator,
    memento,
    http,
    form,
    Singleton,
    Clone,
    Generator,
    Memento,
    Http,
    Form
}
