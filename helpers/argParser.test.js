const parse = require('./argParser');

describe(('parse '), () => {
    test('returns a default object', () => {
        const args = 'some value';
        const parsedCommand = parse(args)
        expect(parsedCommand).toStrictEqual({ default: 'some value'})
    })
    test('returns an empty default object when nothing entered', () => {
        const args = '';
        const parsedCommand = parse(args)
        expect(parsedCommand).toStrictEqual({ default: ''})
    })
    test('returns a single item with a boolean flag set to true', () => {
        const args = '-arg1';
        const parsedCommand = parse(args)
        expect(parsedCommand).toStrictEqual({ arg1: true})
    })
    test('returns a single item with single space param', () => {
        const args = '-arg1 value';
        const parsedCommand = parse(args)
        expect(parsedCommand).toStrictEqual({ arg1: 'value'})
    })
    test('returns a mulitple items', () => {
        const args = '-arg1 some value -arg2 thing2';
        const parsedCommand = parse(args)
        expect(parsedCommand).toStrictEqual({ arg1: 'some value', arg2: 'thing2'})
    })
    test('returns a mulitple items one as a flag boolean', () => {
        const args = '-arg1 -arg2 thing2';
        const parsedCommand = parse(args)
        expect(parsedCommand).toStrictEqual({ arg1: true, arg2: 'thing2'})
    })
    test('returns a mulitple items one as a flag boolean when its second param', () => {
        const args = '-arg1 some value -arg2';
        const parsedCommand = parse(args)
        expect(parsedCommand).toStrictEqual({ arg1: 'some value', arg2: true})
    })
})