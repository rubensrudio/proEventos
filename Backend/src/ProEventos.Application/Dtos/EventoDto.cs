using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ProEventos.Application.Dtos
{
    public class EventoDto
    {
        public int Id { get; set; }
        public string Local { get; set; }
        public string DataEvento { get; set; }
        
        [Required(ErrorMessage = "O campo {0} é obrigatório."),
         StringLength(50, MinimumLength = 3, 
            ErrorMessage = "O campo {0} deve ter entre 3 e 50 caracteres.")]
        public string Tema { get; set; }

        [Range(1, 120000, ErrorMessage = "O campo {0} não pode ser menor que 1 e maior que 120000.")]
        public int QtdPessoas { get; set; }

        [RegularExpression(@".*\.(gif|jpe?g|bmp|png)$",
            ErrorMessage = "Não é uma imagem válida.")]
        public string ImagemUrl { get; set; }
        
        [Required(ErrorMessage = "O campo {0} é obrigatório.")]
        [Phone(ErrorMessage = "O campo {0} não é um telefone válido.")]
        public string Telefone { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório.")]
        [EmailAddress(ErrorMessage = "O campo {0} deve ser um e-mail válido.")]
        public string Email { get; set; }
        public IEnumerable<LoteDto> Lotes { get; set; }
        public IEnumerable<RedeSocialDto> RedesSociais { get; set; }
        public IEnumerable<PalestranteDto> Palestrantes { get; set; }
    }
}