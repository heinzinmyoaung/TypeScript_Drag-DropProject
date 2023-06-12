
export function autobind(_: any, _2: string, descriptors: PropertyDescriptor){
    const originalMethod = descriptors.value
    const adjDescriptor: PropertyDescriptor ={
        configurable: true,
        get(){
            const bondfn = originalMethod.bind(this)
            return bondfn
        }
    }
    return adjDescriptor
}
