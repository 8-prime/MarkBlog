FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /App

# Copy everything
COPY . ./


# Install node for htmx, tailwind and highlighjs
RUN apt-get update && apt-get install -y \
    software-properties-common \
    npm
RUN npm install npm@latest -g && \
    npm install n -g && \
    n latest

WORKDIR "/App/Markblog.Web/"
RUN npm install

RUN node  ./esbuild.build.js

# Restore as distinct layers
RUN dotnet restore ./Markblog.Web.csproj
# Build and publish a release

WORKDIR /App
RUN dotnet publish -c Release -o out ./Markblog.Web/Markblog.Web.csproj

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /App
COPY --from=build-env /App/out .
ENTRYPOINT ["dotnet", "Markblog.Web.dll"]