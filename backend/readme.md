

Create new migrations with for blog changes

``` 
dotnet ef migrations add <MigrationName> --project .\Markblog.Infrastructure\ --startup-project .\Markblog.Web\ --context BlogContext
```

and for auth changes

``` 
dotnet ef migrations add <MigrationName> --project .\Markblog.Infrastructure\ --startup-project .\Markblog.Web\ --context AuthDbContext
```