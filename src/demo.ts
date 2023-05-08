import { defineArguments } from "graphql/type/definition";

interface CV {
    id: string;
    name: string;
    age: number;
    job: string;
    skills: Skill[];
    user: User
}

interface Skill {
    id: string;
    designation: string;
}
enum Role {
    admin = "admin",
    user = "user",
}
interface User {
    id: string;
    name: string;
    email: string;
    role: Role ;
    // cv: CV[];
}
const skill1: Skill = {
    "id": "skill1",
    "designation": "designation1",
}

const skill2: Skill = {
    "id": "skill2",
    "designation": "designation2",
}

const skill3: Skill = {
    "id": "skill3",
    "designation": "designation3",
}

const skill4: Skill = {
    "id": "skill4",
    "designation": "designation4",
}

const user1: User = {
    "id": "user1",
    "name": "name1",
    "email": "email1",
    "role": Role.user,
    // "cv": [cv1, cv2]
}

const user2: User = {
    "id": "user2",
    "name": "name2",
    "email": "email2",
    "role": Role.user,
    // "cv": [cv1, cv2]
}
const cv1: CV = {
    "id": "cv1",
    "name": "name1",
    "age": 20,
    "job": "job1",
    "skills": [skill1, skill2],
    "user": user1
}

const cv2: CV = {
    "id": "cv2",
    "name": "name2",
    "age": 21,
    "job": "job2",
    "skills": [skill3, skill4],
    "user": user2
}
const cv3: CV = {
    "id": "cv3",
    "name": "name3",
    "age": 22,
    "job": "job3",
    "skills": [skill1, skill2],
    "user": user1
}
const cvs: CV[] = [cv1, cv2, cv3];

const users: User[] = [user1, user2];

const skills: Skill[] = [skill1, skill2, skill3, skill4];

/*class _context {
    cvs: CV[] = cvs;
    users: User[] = users;
    skills: Skill[] = skills
}
let context = new _context();
export { context, CV, User, Skill }


 */
export const db = {
    skills,
    users,
    cvs,
} ;
export {Skill,CV,User} ;
