const action = require('./event.js');

describe(('run '), () => {
    test('throws excetption with no argumetns', async () => {
        const testmessage = {
            author: {
                id: 'test-user-id'
            }
        }
        const mockSend = jest.fn();
        const bot = {
            channels: {
                cache:{
                    get: () => {return { send: mockSend}}
                }
            }
        }
        const args = '';

        await action.run(testmessage, args, bot, null)

        expect(mockSend).toHaveBeenCalled()
        expect(mockSend).toHaveBeenCalledWith("No arguments specified")
    });
    test('throws excetption with no command', async () => {
        const testmessage = {
            author: {
                id: 'test-user-id'
            }
        }
        const mockSend = jest.fn();
        const bot = {
            channels: {
                cache:{
                    get: () => {return { send: mockSend}}
                }
            }
        }
        const args = '-name hate -date 6/1/2021 19:00';

        await action.run(testmessage, args, bot, null)

        expect(mockSend).toHaveBeenCalled()
        expect(mockSend).toHaveBeenCalledWith("No command specified")
    });
    test('throws excetption with multiple commands command', async () => {
        const testmessage = {
            author: {
                id: 'test-user-id'
            }
        }
        const mockSend = jest.fn();
        const bot = {
            channels: {
                cache:{
                    get: () => {return { send: mockSend}}
                }
            }
        }
        const args = '-add -remove -name hate -date 6/1/2021 19:00';

        await action.run(testmessage, args, bot, null)

        expect(mockSend).toHaveBeenCalled()
        expect(mockSend).toHaveBeenCalledWith("Too many commands specified")
    });
    test('throws excetption with no name', async () => {
        const testmessage = {
            author: {
                id: 'test-user-id'
            }
        }
        const mockSend = jest.fn();
        const bot = {
            channels: {
                cache:{
                    get: () => {return { send: mockSend}}
                }
            }
        }
        const args = '-add -date 6/1/2021 19:00';

        await action.run(testmessage, args, bot, null)

        expect(mockSend).toHaveBeenCalled()
        expect(mockSend).toHaveBeenCalledWith("No event name specified")
    });
    test('throws excetption with no date', async () => {
        const testmessage = {
            author: {
                id: 'test-user-id'
            }
        }
        const mockSend = jest.fn();
        const bot = {
            channels: {
                cache:{
                    get: () => {return { send: mockSend}}
                }
            }
        }
        const args = '-add -name hate';

        await action.run(testmessage, args, bot, null)

        expect(mockSend).toHaveBeenCalled()
        expect(mockSend).toHaveBeenCalledWith("No event date specified")
    });
    test('-add should call db AND write return message', async () => {
        const testmessage = {
            author: {
                id: 'test-user-id'
            }
        }
        const mockSend = jest.fn();
        const bot = {
            channels: {
                cache:{
                    get: () => {return { send: mockSend}}
                }
            }
        }
        const db = {
            query: (query, args) =>{ }
        }
        const mockQuery = jest.spyOn(db, 'query');
        const args = '-add -name hate -date 6/1/2021 19:00';

        await action.run(testmessage, args, bot, db)

        expect(mockQuery).toHaveBeenCalledWith("INSERT INTO events (name, date, updatedBy) VALUES (?, ?, ?);", ["hate", new Date('6/1/2021 19:00'), 'test-user-id'])
        expect(mockSend).toHaveBeenCalledWith("Added hate to the schedule on June 1, 2021 7:00 PM")
    })
    test('-remove should call db AND write return message', async () => {
        const testmessage = {
            author: {
                id: 'test-user-id'
            }
        }
        const mockSend = jest.fn();
        const bot = {
            channels: {
                cache:{
                    get: () => {return { send: mockSend}}
                }
            }
        }
        const db = {
            query: (query, args) =>{  }
        }
        const mockQuery = jest.spyOn(db, 'query');
        const args = '-remove -name hate -date 6/1/2021 19:00';

        await action.run(testmessage, args, bot, db)

        expect(mockQuery).toHaveBeenCalledWith("UPDATE events SET deletedBy = ? where name = ? and date = ?;", ["test-user-id", "hate", new Date('6/1/2021 19:00')])
        expect(mockSend).toHaveBeenCalledWith("Removed hate on June 1, 2021 7:00 PM from the schedule")
    })
})