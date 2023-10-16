# nest-and-bull-microservices
A system that calculates the Nth prime number for each job and stores the results in a shared database. 

includes 4 containers:
- **app-server**: NestJS controller to create jobs, get job's status, and cancel jobs.
- **worker**: A Bull queue consumer in separate Micro-Service(NestJS) that processes the tasks.
- **mongodb**: Shared database to store job details and results.
- **redis**: Data store used by the Bull queue, serve producers and consumers.

## Quick Start
  
1. Install [Docker Compose](https://docs.docker.com/compose/install/) and make sure it is running in the system background.

2. Fetch the code
 
```bash
$ git clone https://github.com/evgi99/nest-and-bull-microservices.git
```

3. Running all services (detach mode)

```bash
$ cd nest-and-bull-microservices
$ docker-compose up -d 
```

4. Check everything is running (list running processes):
```bash
$ docker ps 

CONTAINER ID   IMAGE                                   .....    PORTS                              NAMES
c7412c97a170   nest-and-bull-microservices-app-server  .....    0.0.0.0:3008->3008/tcp             app-server
db5b0f2118c8   nest-and-bull-microservices-worker      .....                                       worker
0cc8f62ffeaf   mongo                                   .....    0.0.0.0:27017->27017/tcp           mongodb
d3959f0debde   redis/redis-stack:latest                .....    0.0.0.0:6379->6379/tcp, 8001/tcp   redis
```


## Usage (Application Demo) 
> **_NOTE:_** APIs could be tested with help of [Postman](https://www.postman.com/)
### Add a new job to the queue


```
POST http://localhost:3008/api/v1/jobs 
{
    "Nth": 109997
}

RESPONSE: HTTP 201 (Created)
{
    "jobId": "82efd0ae-5549-4721-9c8f-a6b2cb803966"
}
```

### Retrieve job status by id
> **_NOTE:_**  In case of jobStatus is 'completed' it returns the input & the returnValue. otherwise, the response includes only jobId & jobStatus.
```
GET http://localhost:3008/api/v1/jobs/82efd0ae-5549-4721-9c8f-a6b2cb803966

Response: HTTP 200
{
    "jobId": "82efd0ae-5549-4721-9c8f-a6b2cb803966",
    "jobStatus": "completed",
    "returnValue": {
        "nth": 109997,
        "returnValue": 1441007
    }
}
```

### Cancel job by id
> **_NOTE:_**  It works only if the job is running (an active job) or waiting in the queue. Otherwise, the response is BadRequestException with an informative message

```
DELETE http://localhost:3008/api/v1/jobs/b0ac6aba-1293-4eb6-bcec-a1349d0e0cdb

Response: HTTP 200
{
    "messge": "Request to cancel job with id b0ac6aba-1293-4eb6-bcec-a1349d0e0cdb been sent succesfuly"
}
```
