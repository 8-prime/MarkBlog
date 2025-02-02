using MediatR;

namespace Markblog.Application.Commands;

public record CreateImageCommand(byte[] Data) : IRequest<Guid>;