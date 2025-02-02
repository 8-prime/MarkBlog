using MediatR;

namespace Markblog.Application.Commands;

public class CreateImageHandler : IRequestHandler<CreateImageCommand, Guid>
{
    public Task<Guid> Handle(CreateImageCommand request, CancellationToken cancellationToken)
    {
        // take bytes and turn into image
        
        // optimize image
        
        // store image in images directory of fs with guid as name
        
        // store reference to image with id in db
        
        // return id
        
        
        
        return Task.FromResult(Guid.NewGuid());
    }
}