using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace API.Extentions{

    public static class ApplicationServiceExtention
    {
      public static IServiceCollection AddApplicationServices( this IServiceCollection services, IConfiguration config)
      {

        services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IPhotoService, PhotoService>();
        services.AddScoped<LogUserActivity>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);
        services.AddScoped<ILikesRepository, LikesRepository>();
        services.AddScoped<IMessagesRepository, MessageRepository>();

        services.AddDbContext<DataContext>(options => {
            options.UseSqlite(config.GetConnectionString("DefaultConnection"));
        });

        return services;
      }
    }
}