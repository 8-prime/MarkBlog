using MediatR;

namespace Markblog.Application.Queries;

public class ImageHandler : IRequestHandler<ImageQuery, byte[]>
{
    public Task<byte[]> Handle(ImageQuery request, CancellationToken cancellationToken)
    {
        // read image from disk (or cache?)
        return Task.FromResult(Array.Empty<byte>());
    }
}