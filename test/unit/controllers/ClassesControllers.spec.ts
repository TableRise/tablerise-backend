import { Request, Response } from 'express';
import ClassesModel from 'src/database/models/ClassesModel';
import ClassesServices from 'src/services/ClassesServices';
import ClassesControllers from 'src/controllers/ClassesControllers';
import { Class } from 'src/schemas/classesValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import mocks from 'src/support/mocks';

describe('Services :: ClassesControllers', () => {
    const ClassesModelMock = new ClassesModel();
    const ClassesServicesMock = new ClassesServices(ClassesModelMock);
    const ClassesControllersMock = new ClassesControllers(ClassesServicesMock);
    const classMockInstance = mocks.class.instance as Internacional<Class>;
    const request = {} as Request;
    const response = {} as Response;

    describe('When a request is made to recover all classes', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(ClassesServicesMock, 'findAll').mockResolvedValue([classMockInstance]);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            await ClassesControllersMock.findAll(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith([classMockInstance]);
        });
    });

    describe('When a request is made to recover class by ID', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(ClassesServicesMock, 'findOne').mockResolvedValue(classMockInstance);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: classMockInstance._id as string };

            await ClassesControllersMock.findOne(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(classMockInstance);
        });
    });

    describe('When a request is made to update class by ID', () => {
        const classMockUpdateInstance = {
            en: { ...classMockInstance.en, name: 'Bard' },
            pt: { ...classMockInstance.pt, name: 'Bardo' },
        };

        const { _id: _, ...classMockPayload } = classMockInstance;

        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(ClassesServicesMock, 'update').mockResolvedValue(classMockUpdateInstance);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: classMockInstance._id as string };
            request.body = classMockPayload;

            await ClassesControllersMock.update(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(classMockUpdateInstance);
        });
    });

    // describe('When a request is made to delete a class', () => {
    //     beforeAll(() => {
    //         response.status = jest.fn().mockReturnValue(response);
    //         response.end = jest.fn().mockReturnValue({});

    //         jest.spyOn(ClassesServicesMock, 'delete').mockResolvedValue();
    //     });

    //     afterAll(() => {
    //         jest.clearAllMocks();
    //     });

    //     it('should not return any data in response with status 204', async () => {
    //         request.params = { _id: classMockInstance._id as string };

    //         await ClassesControllersMock.delete(request, response);
    //         expect(response.status).toHaveBeenCalledWith(204);
    //         expect(response.end).toHaveBeenCalled();
    //     });
    // });
});
