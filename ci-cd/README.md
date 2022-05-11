# Game of life CI/CD

This folder contains definition of all services used for creating automation environment for Game of Life project. The particular applications are placed inside docker containers described by `docker-compose.yml` file.

## Services

- `gitlab/gitlab-ee:latest` - for storing repository locally,
- `gitlab/gitlab-runner:latest` - for running CI/CD pipeline and executing jobs specified in `.gitlab-ci.yml` file,
- `portainer/portainer-ce:latest` - for monitoring status of dockerized CI/CD stack,
- `sonarqube:community` - for performing static code analysis automatically as a pipeline step,
- `postgres:12` - for storing SonarQube related data (logs, extensions).

## Environment variables

The `docker-compose.yml` file is configured using various environment variable defined in `.env` file inside `ci-cd` folder:

- `COMPOSE_PROJECT_NAME` - Name of the created `docker-compose.yml` stack
- `GITLAB_OMNIBUS_CONFIG_EXTERNAL_URL` - URL on which GitLab will be reachable
- `GITLAB_SERVER_CONTAINER_NAME` - Name of the GitLab container
- `GITLAB_HOME` - Root directory for all GitLab related files and folders
- `GITLAB_PASSWORD` - Password for GitLab admin account
- `GITLAB_RUNNER_CONTAINER_NAME` - Name of the GitLab Runner container
- `GITLAB_RUNNER_TOKEN` - Registration token used to associate GitLab with the Runner
- `GITLAB_RUNNER_CONFIG_DIR` - Root directory for all GitLab Runner related files and folders
- `PORTAINER_CONTAINER_NAME` - Name of the Portainer container
- `PORTAINER_PORT_TCP` - Port, over which a Portainer tunnel server is exposed
- `PORTAINER_PORT_HTTP` - Port, over which a Portainer UI is exposed
- `SONARQUBE_CONTAINER_NAME` - Name of the SonarQube container
- `SONAR_WEB_PORT` - Port, over which a SonarQube UI is exposed
- `POSTGRES_CONTAINER_NAME` - Name of the PostgreSQL container
- `POSTGRES_USER` - Name of the PostgreSQL user, created during database initialization
- `POSTGRES_PASSWORD` - Password of the PostgreSQL user, created during database initialization
- `POSTGRES_DB_NAME` - Name of the PostgreSQL database, created during database initialization
- `POSTGRES_PORT` - Port over which the PostgreSQL is exposed

## GitLab runner config

The `ci-cd` folder contains a subdirectory with `config.toml` file for configuration of the GitLab Runner. It is used during runner's registration and has few caveats, that are described below:

- `network_mode` - has to match the network in which GitLab Server was created. Otherwise the Runner won't be able to checkout the repository while executing the pipeline
- `clone_url` - It overwrites GitLab's instance URL, to properly clone the repository. GitLab's external url is configured to be `http://localhost` (default), but the GitLab Runner has to communicate with it using its hostname, specified in `docker-compose.yml` file.

## Integrating SonarQube with GitLab instance

All steps required for integrating SonarQube with locally set up GitLab instance will be described at `http://localhost:9000/projects/create`, after clicking the GitLab integration icon.

The default credentials for first time login in SonarQube are `login: admin`, `password: admin`. You will be then prompted to set new password.
The integration will require creating personal access token for GitLab account and providing it inside SonarQube, as well as setting environment variable for executing static code analysis as a step inside `.gitlab-ci.yml` file. I would suggest creating separate user related to this and impersonating a token for his account, not the admin one.

## Ensuring SonarQube platform requirements

In order to successfully run SonarQube, the [following requirements](https://docs.sonarqube.org/latest/requirements/requirements/) have to be ensured:

- `vm.max_map_count` is greater than or equal to 524288
- `fs.file-max` is greater than or equal to 131072
- the user running SonarQube can open at least 131072 file descriptors
- the user running SonarQube can open at least 8192 threads

The quickest options is to set them dynamically for current session running as root (note that this step will be required each time the machine is restarted):

```bash
sysctl -w vm.max_map_count=524288
sysctl -w fs.file-max=131072
ulimit -n 131072
ulimit -u 8192
```

## Build

To create a dockerized stack with provided services in detached mode, run the following command:

```bash
cd ci-cd
docker-compose --env-file ./.env up -d
```

Before running the stack, you can validate your configuration file using `docker compose config`.

### Remove stack

To remove the stack and all of its named volumes, run the following command:

```bash
cd ci-cd
docker-compose down -v
```

## Registering the GitLab runner

In order to enable GitLab Runner to pick up the jobs and execute them in docker environment, it must be registered by the GitLab instance. To do this, it requires GitLab token, available under Menu -> Admin -> Overview -> Runners -> Register an instance runner.

After retrieving the GitLab token, next step is to use during Runner registration:

```bash
docker exec -it gitlab-runner bash
# inside container
gitlab-runner register \
  --non-interactive \
  --url "<GITLAB_URL>" \
  --config "/etc/gitlab-runner/config.toml" \
  --registration-token "<PROJECT_REGISTRATION_TOKEN>" \
  --executor "docker" \
  --docker-image alpine:latest \
  --description "docker-runner" \
  --maintenance-note "Free-form maintainer notes about this runner" \
  --tag-list "docker,gol" \
  --run-untagged="true" \
  --locked="false" \
  --access-level="not_protected"
```

Be sure to include `--run-untagged="true"` flag, otherwise the runner will only pick up GitLab projects with matching tags.
Now the executor should be visible in the GitLab UI and ready to pickup jobs defined by `.gitlab-ci-yml` in root folder.
You can create multiple executor on the same GitLab Runner instance.

## Useful Links

- [Installing GitLab using docker compose](https://docs.gitlab.com/ee/install/docker.html#install-gitlab-using-docker-compose)
- [GitLab config template](https://gitlab.com/gitlab-org/omnibus-gitlab/blob/master/files/gitlab-config-template/gitlab.rb.template)
- [.gitlab-ci.yml file](https://docs.gitlab.com/ee/ci/yaml/gitlab_ci_yaml.html)
- [GitLab Runner installation](https://docs.gitlab.com/runner/install/)
- [GitLab Runner registration](https://docs.gitlab.com/runner/register/)
- [GitLab Runner configuration](https://docs.gitlab.com/ee/ci/runners/configure_runners.html)
- [GitLab Docker executor](https://docs.gitlab.com/runner/executors/docker.html#use-docker-in-docker-with-privileged-mode)
- [GitLab personal access token](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html)
- [Private CI/CD using self-hosted GitLab](https://oramind.com/private-cicd-using-gitlab-docker/)
- [Portainer with Docker on Linux](https://docs.portainer.io/v/ce-2.11/start/install/server/docker/linux)
- [SonarQube docks](https://docs.sonarqube.org/latest/)
- [SonarQube integration with GitLab](https://docs.sonarqube.org/latest/analysis/gitlab-integration/)
- [SonarQube tokens](https://docs.sonarqube.org/latest/user-guide/user-token/)
- [Communication between multiple docker stacks](https://stackoverflow.com/questions/38088279/communication-between-multiple-docker-compose-projects)
