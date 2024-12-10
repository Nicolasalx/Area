FROM ubuntu:latest

ENV DEBIAN_FRONTEND=noninteractive
ENV ANDROID_HOME=/opt/android-sdk
ENV FLUTTER_HOME=/home/developer/flutter
ENV PATH=${PATH}:${FLUTTER_HOME}/bin:${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/platform-tools
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64

RUN apt-get update && apt-get install -y \
    curl \
    git \
    unzip \
    xz-utils \
    zip \
    libglu1-mesa \
    openjdk-17-jdk \
    wget

RUN useradd -ms /bin/bash developer
RUN mkdir -p ${ANDROID_HOME} && chown -R developer:developer ${ANDROID_HOME}

# Install Android SDK
RUN mkdir -p ${ANDROID_HOME}/cmdline-tools && \
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip && \
    unzip *tools*linux*.zip -d ${ANDROID_HOME}/cmdline-tools && \
    mv ${ANDROID_HOME}/cmdline-tools/cmdline-tools ${ANDROID_HOME}/cmdline-tools/latest && \
    rm *tools*linux*.zip && \
    chown -R developer:developer ${ANDROID_HOME}

USER developer

# Accept licenses and install Android SDK components
RUN mkdir -p ${ANDROID_HOME}/.android && \
    touch ${ANDROID_HOME}/.android/repositories.cfg

RUN yes | sdkmanager --licenses && \
    sdkmanager --update && \
    sdkmanager \
    "platform-tools" \
    "platforms;android-33" \
    "platforms;android-34" \
    "platforms;android-35" \
    "build-tools;33.0.0" \
    "build-tools;33.0.1" \
    "build-tools;33.0.2" \
    "build-tools;34.0.0"

# Install Flutter in the user's home directory
WORKDIR /home/developer
RUN git clone https://github.com/flutter/flutter.git ${FLUTTER_HOME} && \
    cd ${FLUTTER_HOME} && \
    git checkout stable && \
    flutter precache && \
    flutter config --no-analytics && \
    flutter doctor --android-licenses && \
    flutter doctor -v

WORKDIR /app

COPY --chown=developer:developer . .

RUN flutter pub get
RUN flutter build apk --release

CMD ["echo", "Mobile build completed"]