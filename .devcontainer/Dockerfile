FROM mcr.microsoft.com/vscode/devcontainers/typescript-node

WORKDIR /workspace

ARG USERNAME=node
ARG USER_UID=1000
ARG USER_GID=$USER_UID
ARG DOCKER_COMPOSE_VERSION

RUN if [ "$USER_GID" != "1000" ] || [ "$USER_UID" != "1000" ]; then \
  groupmod --gid $USER_GID $USERNAME \
  && usermod --uid $USER_UID --gid $USER_GID $USERNAME \
  && chown -R $USER_UID:$USER_GID /home/$USERNAME; \
  fi

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update \
  && apt-get install -y postgresql-client \
  && curl -sSL "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose \
  && chmod +x /usr/local/bin/docker-compose \
  && apt-get autoremove -y \
  && apt-get clean -y \
  && rm -rf /var/lib/apt/lists/*
ENV DEBIAN_FRONTEND=dialog

RUN touch /var/run/docker.sock \
    && chown $USERNAME:$USERNAME /var/run/docker.sock

RUN mkdir -p /workspace/node_modules \
    && chown $USERNAME:$USERNAME /workspace/node_modules

RUN mkdir -p /home/$USERNAME/.vscode-server/extensions \
  /home/$USERNAME/.vscode-server-insiders/extensions \
  && chown -R $USERNAME \
  /home/$USERNAME/.vscode-server \
  /home/$USERNAME/.vscode-server-insiders

RUN SNIPPET="export PROMPT_COMMAND='history -a' && export HISTFILE=/commandhistory/.bash_history" \
  && echo $SNIPPET >> "/root/.bashrc" \
  && mkdir /commandhistory \
  && touch /commandhistory/.bash_history \
  && chown -R $USERNAME /commandhistory \
  && echo $SNIPPET >> "/home/$USERNAME/.bashrc"

RUN npm completion >> /home/$USERNAME/.bashrc

COPY files/web/dev.bashrc /home/${USERNAME}
RUN echo '\n\
  if [ -f ~/dev.bashrc ]; then\n\
  . ~/dev.bashrc\n\
  fi'\
  >> "/home/$USERNAME/.bashrc"

USER $USER_UID

RUN git config --global --add safe.directory /workspace