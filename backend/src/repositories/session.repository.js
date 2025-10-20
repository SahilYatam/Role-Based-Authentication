import { Session } from "../models/session.model.js";

const createSession = (payload) => Session.create(payload);

const updateSessionById = async (id, updates) => {
    Session.updateOne({_id: id}, {$set: updates});
}

const findSession = async (filter) => {
    Session.findOne(filter).lean();
}

const deleteExpiredSessions = async (batchSize = 500) => {
    let totalDeleted = 0;
    while(true){
        const expired = await Session.find(
            {isActive: false, expiresAt: {$lt: new Date()}},
            {_id: 1}
        ).limit(batchSize).lean();

        if(expired.length === 0) break;

        const ids = expired.map(s => s._id);
        const { deletedCount } = await Session.deleteMany({_id: {$in: ids}});
        totalDeleted += deletedCount;

        await new Promise(res => setTimeout(res, 100));
    }
    return totalDeleted;
}

export const sessionRepo = {
    createSession,
    updateSessionById,
    findSession,
    deleteExpiredSessions
}
