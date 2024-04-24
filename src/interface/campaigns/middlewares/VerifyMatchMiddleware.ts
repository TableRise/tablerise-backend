import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';
import { NextFunction, Request, Response } from 'express';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';

export default class VerifyMatchMiddleware { 
    private readonly _campaignsRepository;
    private readonly _logger;

    constructor({
        campaignsRepository,
        logger,
    }: InterfaceDependencies['verifyMatchMiddlewareContract']) {
        this._campaignsRepository = campaignsRepository;
        this._logger = logger;
        this.exists = this.exists.bind(this);
    }

    public async exists(req: Request, _res: Response, next: NextFunction): Promise<void> {
        this._logger('warn', 'Exists - VerifyMatchMiddleware');
        const { id } = req.params;
        const { matchData } = await this._campaignsRepository.findOne({ id });

        if(!matchData)  HttpRequestErrors.throwError('campaign-match-inexistent');
        this._logger('info', 'Exists - campaign has an active match');
        next();
    }
}