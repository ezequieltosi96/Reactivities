using System;

namespace Domain
{
    public class Value
    {
        // Por convencion de nombres, EntityFramework tratara esta porp como PRIMARY KEY
        public int Id { get; set; }

        public string Name { get; set; }

    }
}
