FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build-env
WORKDIR /App

COPY . ./
WORKDIR "/App/Markblog.Web/"
RUN dotnet restore ./Markblog.Web.csproj

RUN dotnet publish -c Release -o /out ./Markblog.Web.csproj

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0-alpine
WORKDIR /App

# Copy the published output from the build stage
COPY --from=build-env /out .

ENV ASPNETCORE_URLS=http://*:8080
ENV ApplicationSettings:ImageDirectory=/etc/markblog/images

ENTRYPOINT ["dotnet", "Markblog.Web.dll"]