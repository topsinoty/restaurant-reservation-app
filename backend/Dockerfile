FROM eclipse-temurin:25-jdk AS build

WORKDIR /workspace

COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .

RUN ./mvnw -B -DskipTests dependency:go-offline

COPY src src

RUN ./mvnw -B -DskipTests package




FROM eclipse-temurin:25-jre

WORKDIR /app

COPY --from=build /workspace/target/*.jar /app/app.jar

RUN useradd -m appuser
USER appuser

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
