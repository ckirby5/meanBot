const action = require('./event.js');

describe(('run '), () => {
    test('throws excetption with no argumetns', () => {
        const mockSend = jest.fn();
        const bot = {
            channels: {
                cache:{
                    get: () => {return { send: mockSend}}
                }
            }
        }
        const args = '';

        action.run('', args, bot, null)

        expect(mockSend).toHaveBeenCalled()
        expect(mockSend).toHaveBeenCalledWith("No arguments specified")
    });
    test('throws excetption with no command', () => {
        const mockSend = jest.fn();
        const bot = {
            channels: {
                cache:{
                    get: () => {return { send: mockSend}}
                }
            }
        }
        const args = '-name hate -date 6/1/2021 19:00';

        action.run('', args, bot, null)

        expect(mockSend).toHaveBeenCalled()
        expect(mockSend).toHaveBeenCalledWith("No command specified")
    });
    test('throws excetption with multiple commands command', () => {
        const mockSend = jest.fn();
        const bot = {
            channels: {
                cache:{
                    get: () => {return { send: mockSend}}
                }
            }
        }
        const args = '-add -remove -name hate -date 6/1/2021 19:00';

        action.run('', args, bot, null)

        expect(mockSend).toHaveBeenCalled()
        expect(mockSend).toHaveBeenCalledWith("Too many commands specified")
    });
    test('throws excetption with no name', () => {
        const mockSend = jest.fn();
        const bot = {
            channels: {
                cache:{
                    get: () => {return { send: mockSend}}
                }
            }
        }
        const args = '-add -date 6/1/2021 19:00';

        action.run('', args, bot, null)

        expect(mockSend).toHaveBeenCalled()
        expect(mockSend).toHaveBeenCalledWith("No event name specified")
    });
    test('throws excetption with no date', () => {
        const mockSend = jest.fn();
        const bot = {
            channels: {
                cache:{
                    get: () => {return { send: mockSend}}
                }
            }
        }
        const args = '-add -name hate';

        action.run('', args, bot, null)

        expect(mockSend).toHaveBeenCalled()
        expect(mockSend).toHaveBeenCalledWith("No event date specified")
    });
    test('should call db AND write return message', () => {
        const mockSend = jest.fn();
        const bot = {
            channels: {
                cache:{
                    get: () => {return { send: mockSend}}
                }
            }
        }
        const mockQuery = jest.fn()
        const db = {
            query: mockQuery
        }
        const args = '-add -name hate -date 6/1/2021 19:00';

        action.run('', args, bot, db)

        expect(mockQuery).toHaveBeenCalled()
    })
})