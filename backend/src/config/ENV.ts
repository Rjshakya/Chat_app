
interface IenvVariables{
  PORT:string|undefined
  MONGO_URL:string|undefined
  AWSACCESSKEYID:string|undefined
  AWSSECRETACCESSKEYID:string|undefined
}

const envVariables:IenvVariables = {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  AWSACCESSKEYID: process.env.ACCESSKEYID,
  AWSSECRETACCESSKEYID: process.env.SECRETACCESSKEY,
};

export default envVariables;
