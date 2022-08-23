using System;
using System.Threading.Tasks;
using AutoMapper;
using ProEventos.Application.Dtos;
using ProEventos.Application.Interfaces;
using ProEventos.Domain;
using ProEventos.Persistence.Interfaces;

namespace ProEventos.Application
{
    public class EventoService : IEventoService
    {
        private readonly IGeralPersistence geralPersistence;
        private readonly IEventoPersistence eventoPersistence;
        private readonly IMapper mapper;

        public EventoService(IGeralPersistence geralPersistence, 
                            IEventoPersistence eventoPersistence,
                            IMapper mapper)
        {
            this.geralPersistence = geralPersistence;
            this.eventoPersistence = eventoPersistence;
            this.mapper = mapper;

        }
        public async Task<EventoDto> AddEvento(EventoDto model)
        {
            try
            {
                var evento = mapper.Map<Evento>(model);

                this.geralPersistence.Add<Evento>(evento);
                if (await this.geralPersistence.SaveChangesAsync())
                {
                    var eventoRetorno = await this.eventoPersistence.GetEventoByIdAsync(evento.Id, false);
                    return mapper.Map<EventoDto>(eventoRetorno);
                }
                return null;
            }
            catch (Exception ex)
            {                
                throw new Exception(ex.Message);
            }
        }

        public async Task<EventoDto> UpdateEvento(int eventoId, EventoDto model)
        {
            try
            {
                var evento = await this.eventoPersistence.GetEventoByIdAsync(eventoId, false);
                if (evento == null) return null;

                model.Id = evento.Id;

                mapper.Map(model, evento);

                this.geralPersistence.Update<Evento>(evento);
                if (await this.geralPersistence.SaveChangesAsync()){
                    var retornoEvento = await this.eventoPersistence.GetEventoByIdAsync(evento.Id, false);
                    return mapper.Map<EventoDto>(retornoEvento);
                }
                return null;
            }
            catch (Exception ex)
            {                
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeleteEvento(int eventoId)
        {
            try
            {
                var evento = await this.eventoPersistence.GetEventoByIdAsync(eventoId, false);
                if (evento == null) throw new Exception("Evento não encontrado");

                this.geralPersistence.Delete<Evento>(evento);
                return await this.geralPersistence.SaveChangesAsync();
                
            }
            catch (Exception ex)
            {                
                throw new Exception(ex.Message);
            }
        }

        public async Task<EventoDto> GetEventoByIdAsync(int eventoId, bool includePalestrantes = false)
        {
            try
            {
                var evento = await this.eventoPersistence.GetEventoByIdAsync(eventoId, includePalestrantes);
                if (evento == null) return null;

                var resultado = mapper.Map<EventoDto>(evento);

                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<EventoDto[]> GetAllEventosAsync(bool includePalestrantes = false)
        {
            try
            {
                var eventos = await this.eventoPersistence.GetAllEventosAsync(includePalestrantes);
                if (eventos == null) return null;

                var resultado = mapper.Map<EventoDto[]>(eventos);

                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<EventoDto[]> GetAllEventosByTemaAsync(string tema, bool includePalestrantes = false)
        {
            try
            {
                var eventos = await this.eventoPersistence.GetAllEventosByTemaAsync(tema, includePalestrantes);
                if (eventos == null) return null;

                var resultado = mapper.Map<EventoDto[]>(eventos);

                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}