using MediatR;

namespace Markblog.Application.Queries;

public record ImageQuery(Guid Id) : IRequest<byte[]?>;