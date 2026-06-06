import RegisterDonationService from 'src/core/users/services/users/RegisterDonationService';
import EmailSender from 'src/domains/users/helpers/EmailSender';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import { Logger } from 'src/types/shared/logger';

export interface RegisterDonationOperationContract {
    registerDonationService: RegisterDonationService;
    logger: Logger;
}

export interface RegisterDonationServiceContract {
    usersDetailsRepository: UsersDetailsRepository;
    emailSender: EmailSender;
    logger: Logger;
}
