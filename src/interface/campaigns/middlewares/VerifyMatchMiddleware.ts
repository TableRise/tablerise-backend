import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';
import { NextFunction, Request, Response } from 'express';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';

export default class VerifyMatchMiddleware {
    private readonly campaignsRepository;
    private readonly logger;

    constructor({ campaignsRepository, logger }: InterfaceDependencies['verifyMatchMiddlewareContract']) {
        this.campaignsRepository = campaignsRepository;
        this.logger = logger;
        this.exists = this.exists.bind(this);
    }

    public async exists(req: Request, _res: Response, next: NextFunction): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.exists.name}`;
        this.logger('info', callName);

        const { id } = req.params;
        const campaign = await this.campaignsRepository.findOne({ campaignId: id });

        if (!campaign) HttpRequestErrors.throwError('campaign-inexistent');
        if (!campaign.matchData) HttpRequestErrors.throwError('campaign-match-inexistent');

        this.logger('info', 'Exists - campaign has an active match');
        next();
    }
}
