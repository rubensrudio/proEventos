using System;
using System.Threading.Tasks;
using ProEventos.Application.Interfaces;
using ProEventos.Domain;
using ProEventos.Persistence.Interfaces;

namespace ProEventos.Application
{
    public class EventoService : IEventoService
    {
        private readonly IGeralPersistence geralPersistence;
        private readonly IEventoPersistence eventoPersistence;
        public EventoService(IGeralPersistence geralPersistence, IEventoPersistence eventoPersistence)
        {
            this.eventoPersistence = eventoPersistence;
            this.geralPersistence = geralPersistence;

        }
        public async Task<Evento> AddEvento(Evento model)
        {
            try
            {
                this.geralPersistence.Add<Evento>(model);
                if (await this.geralPersistence.SaveChangesAsync())
                {
                    return await this.eventoPersistence.GetEventoByIdAsync(model.Id, false);
                }
                return null;
            }
            catch (Exception ex)
            {                
                throw new Exception(ex.Message);
            }
        }

        public async Task<Evento> UpdateEvento(int eventoId, Evento model)
        {
            try
            {
                var evento = await this.eventoPersistence.GetEventoByIdAsync(eventoId, false);
                if (evento == null) return null;

                model.Id = evento.Id;

                this.geralPersistence.Update(model);
                if (await this.geralPersistence.SaveChangesAsync()){
                    return await this.eventoPersistence.GetEventoByIdAsync(model.Id, false);
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

        public async Task<Evento> GetEventoByIdAsync(int eventoId, bool includePalestrantes = false)
        {
            try
            {
                return await this.eventoPersistence.GetEventoByIdAsync(eventoId, includePalestrantes);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<Evento[]> GetAllEventosAsync(bool includePalestrantes = false)
        {
            try
            {
                return await this.eventoPersistence.GetAllEventosAsync(includePalestrantes);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<Evento[]> GetAllEventosByTemaAsync(string tema, bool includePalestrantes = false)
        {
            try
            {
                return await this.eventoPersistence.GetAllEventosByTemaAsync(tema, includePalestrantes);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}