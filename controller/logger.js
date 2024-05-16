import { createLogger, transports, format } from "winston";

const logger = createLogger({
    transports:[
        new transports.File({
            filename: 'logs/logs.log',
            level: 'info',
            format: format.combine(format.timestamp(), format.json())
        })
    ]
});
export{logger}