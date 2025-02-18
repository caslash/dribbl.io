# Change ownership of docker.sock to current user
if [ -e /var/run/docker.sock ]; then
  sudo chown $(id -u):$(id -g) /var/run/docker.sock
fi

parse_git_branch() {
  git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/(\1)/'
}

PS1="\[\e[01;32m\]\u@\h\[\e[00m\]:\[\e[36m\]\w \[\e[33m\]\$(parse_git_branch)\[\e[00m\]$ "

# Clear environment variable set by VSCode Remote on launch of shell
unset VERBOSE_LOGGING

# Add git completion
source /usr/share/bash-completion/completions/git
