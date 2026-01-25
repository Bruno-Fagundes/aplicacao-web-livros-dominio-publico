FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn dependency:go-offline -B
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN mkdir -p /app/uploads
COPY --from=build /app/target/*.jar app.jar
COPY --from=build /app/src/main/resources/static/pdfs /app/pdfs
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
