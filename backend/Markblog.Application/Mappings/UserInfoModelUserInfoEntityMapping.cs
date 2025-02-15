using Domain.Entities;
using Markblog.Application.Models;

namespace Markblog.Application.Mappings;

public static class UserInfoModelUserInfoEntityMapping
{
    public static UserInfoModel MapToModel(this UserInfoEntity userInfo)
    {
        return new UserInfoModel
        {
            Id = userInfo.Id,
            Description = userInfo.Description,
            Name = userInfo.Name,
            ImageUrl = userInfo.ImageUrl,
        };
    }
}