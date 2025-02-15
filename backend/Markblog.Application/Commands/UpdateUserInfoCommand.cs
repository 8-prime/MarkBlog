using Markblog.Application.Models;
using MediatR;

namespace Markblog.Application.Commands;

public record UpdateUserInfoCommand(UserInfoModel UserInfoModel) : IRequest;