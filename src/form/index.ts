import FormField from "./field"

class Form {
    private field: FormField

    constructor() {
        this.field = new FormField()
    }

    public TransField<T>(target: unknown): T {
        if (Array.isArray(target)) {
            const res = this.field.Trans<{ target: T }>({ target })
            return res.target
        }
        return this.field.Trans(target)
    }

    public RevertField<T>(target: unknown): T {
        if (Array.isArray(target)) {
            const res = this.field.Revert<{ target: unknown }>({ target })
            return res.target as T
        }
        return this.field.Revert(target)
    }
}

export default Form
