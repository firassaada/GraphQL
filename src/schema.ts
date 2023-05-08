import { createPubSub, createSchema } from "graphql-yoga";
import {  db,Skill,CV } from "./demo";
import { realpathSync } from "fs";
import { log } from "console";
import { GraphQLError } from "graphql";
import { resolve } from "path";
const fs = require("fs");
const path = require("path");
const CV_UPDATED = 'CV_UPDATED';
const CV_DELETED = 'CV_DELETED';
const CV_ADDED = 'CV_ADDED';
const pubSub = createPubSub();
export const schema = createSchema({
    typeDefs: fs.readFileSync(
        path.join(__dirname, "schema/schema.graphql"),
        "utf-8"
    ),
    resolvers: {
        Subscription: {
                    cvUpdated: {
                        subscribe: () => pubSub.subscribe(CV_UPDATED),
                        resolve: (payload) => { return payload }
                    }
                },

        Query: {
            hello: () => "Hello World!",
            cvs: (parent, args, ctx, info) => {
                return db.cvs;
            },
            cv: (parent, args, ctx, info) => {

                return db.cvs.find(cv => cv.id === args.id);
            },
            getCvSkills: (parent, args, ctx, info) => {
                return db.cvs.find(cv => cv.id === args.cvid)?.skills;
            },

            getCvUsers: (parent, args, ctx, info) => {
                return db.cvs.find(cv => cv.id === args.cvid)?.user;
            },

        },
        Mutation: {
            addCv: (parent, args, ctx, info) => {
                const { name, age, job,userId, skillIds } = args.input;
                console.log(skillIds) ;
                    const skills = db.skills.filter((skill) => skillIds.includes(skill.id));
                    if (skills.length === 0) {
                        throw new GraphQLError(`Element with not found.`)
                    }
                    // skills.push(context.skills.filter((skill) => skill.id === id))

                const _user = db.users.find(user => args.input.userId == user.id);
                const cv = {
                    id  : "cv" + db.cvs.length!,
                    name: args.input.name,
                    age: args.input.age,
                    job: args.input.job,
                    skills: skills,
                    user: _user!,
                }
                console.log(cv);
                db.cvs.push(cv)
                pubSub.publish(CV_UPDATED, { msg: 'CV_ADDED', cv: cv });

                return cv;
            },
            updateCv: (parent, args, ctx, info) => {
                let _cv = db.cvs.find(cv => cv.id === args.input.id);
                console.log(_cv);
                const { name, age, job,userId, skillIds } = args.input;
                console.log(skillIds) ;
                const skills = db.skills.filter((skill) => skillIds.includes(skill.id));

                if(!_cv)
                    throw new GraphQLError("cv not found")
                if (skills.length === 0) {
                    throw new GraphQLError(`Elements not found.`)
                }
                const index = db.cvs.indexOf(_cv);
                _cv!.name = args.input.name;
                _cv!.age = args.input.age;
                _cv!.job = args.input.job;
                    // skills.push(context.skills.filter((skill) => skill.id === id))
                _cv!.skills = skills;
                const _user = db.users.find(user => args.input.userId == user.id);
                if(!_user)
                    throw new GraphQLError("user not found") ;
                _cv!.user = _user!;
                db.cvs[index] = _cv!
                pubSub.publish(CV_UPDATED, { msg: 'CV_UPDATED', cv: _cv });
                return _cv;
            },
            deleteCv: (parent, args, ctx, info) => {
                const _cv = db.cvs.find(cv => cv.id === args.id);
                if(!_cv)
                    throw new GraphQLError("cv not found") ;
                const index = db.cvs.indexOf(_cv);
                 db.cvs.splice(index, 1)
                pubSub.publish(CV_UPDATED, { msg: 'CV_DELETED', cv: _cv });

                return true;
            }
        },
    }
})