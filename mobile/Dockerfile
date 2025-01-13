FROM ghcr.io/cirruslabs/android-sdk:34 AS builder

RUN apt-get update && apt-get install -y \
    curl \
    git \
    unzip \
    xz-utils \
    zip \
    libglu1-mesa \
    openjdk-17-jdk \
    && rm -rf /var/lib/apt/lists/*

ENV FLUTTER_HOME=/opt/flutter
ENV FLUTTER_VERSION=3.27.1
RUN git clone --branch ${FLUTTER_VERSION} https://github.com/flutter/flutter.git $FLUTTER_HOME

ENV PATH="$FLUTTER_HOME/bin:$PATH"

RUN flutter precache

ENV ANDROID_HOME=/opt/android-sdk
ENV PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"

WORKDIR /app
COPY . .

RUN flutter config --no-analytics && \
    flutter pub get && \
    flutter build apk --release

FROM alpine:latest

WORKDIR /app
COPY --from=builder /app/build/app/outputs/flutter-apk/app-release.apk .

CMD ["tail", "-f", "/dev/null"]